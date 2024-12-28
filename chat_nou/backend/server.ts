import { Hono } from "hono";
import { config } from "dotenv";
import { ChatGroq } from "@langchain/groq";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { readFile } from "fs";
import { join } from "path";
import {
	ChatPromptTemplate,
	MessagesPlaceholder,
} from "@langchain/core/prompts";
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static';

type Message = {
	content: string;
	isUser: boolean;
};

config();
const app = new Hono({});



const model = new ChatGroq({
	apiKey: process.env.GROQ_API_KEY || "",
	maxTokens: undefined,
	model: "llama-3.1-8b-instant",
});

// Ruta para servir el archivo HTML
app.get("/", async (c) => {
	// Leer el contenido del archivo index.html
	const htmlPath = join(process.cwd(), "frontend", "index.html");
	const htmlContent = await new Promise<string>((resolve, reject) => {
		readFile(htmlPath, "utf8", (err, data) => {
			if (err) reject(err);
			else resolve(data);
		});
	});

	// Establecer el tipo de contenido como HTML
	c.header("Content-Type", "text/html");

	// Devolver el contenido del archivo HTML
	return c.body(htmlContent);
});

app.get("/styles.css", async (c) => {
	const cssPath = join(process.cwd(), "frontend", "styles.css");
	const cssContent = await new Promise<string>((resolve, reject) => {
		readFile(cssPath, "utf8", (err, data) => {
			if (err) reject(err);
			else resolve(data);
		});
	});
	
	c.header("Content-Type", "text/css");
	return c.body(cssContent);
});

app.post("/chat", async (c) => {
	const { messages } = (await c.req.json()) as {
		messages: Message[];
	};

	try {
		const parsedMessages = messages.map((msg) =>
			msg.isUser
				? new HumanMessage({
					content: msg.content,
					additional_kwargs: { role: "user" },
				})
				: new AIMessage({
					content: msg.content,
					additional_kwargs: { role: "user" },
				})
		);

		const prompt = ChatPromptTemplate.fromMessages([
			[
				"system",
				`Eres los Reyes Magos conversando con un niño. Debes:

				1. SIEMPRE responder con precisión a las preguntas, pero de forma mágica y festiva
				2. Usar emojis festivos (🎄✨⭐🎁🐪👑)
				3. Hablar en primera persona plural ("nosotros")
				4. Ser precisos con fechas y datos reales
				5. Firmar como "Melchor, Gaspar y Baltasar"

				Ejemplo de respuesta a "¿Qué día es hoy?":
				"¡Querido pequeñín! 🎄✨

				¡Hoy es 28 de diciembre! Mientras nuestros camellos preparan el viaje para la noche de Reyes ⭐, estamos muy ocupados revisando todas las cartas. ¡Solo faltan 9 días para encontrarnos! 🎁

				¡Con cariño mágico! 👑
				Melchor, Gaspar y Baltasar ✨"

				Recuerda: Sé preciso con la información pero mantén el tono mágico y festivo.`,
			],
			new MessagesPlaceholder("messages"),
		]);

		const chain = prompt.pipe(model);

		const completion = await chain.invoke({ messages: parsedMessages });

		const response = completion.content;

		return c.json({ response });
	} catch (error) {
		console.error("Error al procesar la solicitud de chat:", error);

		return c.json({ error: "Error al procesar la solicitud de chat" }, 500);
	}
});

// Añadir esta ruta para servir imágenes
app.use('/images/*', serveStatic({ root: './frontend' }));

// serve(app);
serve({
	fetch: app.fetch,
	port: 3000,
	hostname: "localhost"
}, () => {
	console.log('\n🚀 Servidor corriendo en: http://localhost:3000\n');
});
