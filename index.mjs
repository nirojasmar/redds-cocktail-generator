import express from 'express';
import OpenAI from 'openai';
import 'dotenv/config'


const openai = new OpenAI();
const app = express();
app.use(express.json());
app.use(express.static('public')); // Para servir archivos estáticos

openai.apiKey = process.env.OPENAI_API_KEY;

const cocktails = [
    { name: "Lulo Twist", description: "Un cóctel con cerveza Redd's, jugo de lulo, zumo de limon y hierbabuena. Tiene un sabor ácido y fresco." },
    { name: "Maracuyá Rush", description: "Un cóctel con cerveza Redd's, jugo de maracuyá, limón y hierbabuena. Es ácido y tiene un toque amargo" },
    { name: "Redd's & Granadilla", description: "Cóctel con Redd's, granadilla, limón y hierbabuena. Tiene un sabor discreto y refrescante." },
    { name: "Arándanos Punch", description: "Un cóctel sencillo con jugo de arándanos rojos, Redd's y sirope de granandina. Es dulce, divertido, romántico y colorido." },
    { name: "Redd's Splash", description: "Una variación de la laguna azul con Blue Curacao, Redd's y Sprite. Es dulce, refrescante, con algunos toques un poco ácidos e introvertido" }
];


app.post('/generate-cocktail', async (req, res) => {
    const { flavor, type, mood, company } = req.body;

    const cocktailOptions = cocktails.map(c => `${c.name}: ${c.description}`).join('\n');

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: `Eres un asistente especializado en cocteles. Elige o adapta una receta de cóctel basandote en estas opciones:\n\n ${cocktailOptions} \n` },
                {
                    role: 'user',
                    content: `Quiero un cóctel ${flavor}, ${type}, ${mood} y que se comparta ${company}.`
                }
            ]
        });

        const cocktail = response.choices[0].message.content;
        console.log(cocktail);
        res.json({ cocktail });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Algo salió mal al generar la receta.' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});