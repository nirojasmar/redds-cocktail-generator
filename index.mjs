import express from 'express';
import OpenAI from 'openai';
import 'dotenv/config'


const openai = new OpenAI();
const app = express();
app.use(express.json());
app.use(express.static('public')); // Para servir archivos estáticos

openai.apiKey = process.env.OPENAI_API_KEY;

const cocktails = [
    { name: "Margarita", description: "Un cóctel con tequila, jugo de limón, y licor de naranja. Tiene un sabor ácido y fresco." },
    { name: "Old Fashioned", description: "Un cóctel clásico con whisky, azúcar, y bitters. Es amargo y fuerte." },
    { name: "Mojito", description: "Cóctel cubano con ron, menta, azúcar, jugo de lima, y agua con gas. Es dulce y refrescante." },
    { name: "Daiquiri", description: "Un cóctel sencillo con ron, jugo de lima, y azúcar. Es ácido y dulce." },
    { name: "Negroni", description: "Un cóctel amargo con ginebra, vermut rojo, y Campari. Tiene un sabor fuerte y herbáceo." }
];


app.post('/generate-cocktail', async (req, res) => {
    const { flavor, type } = req.body;

    const cocktailOptions = cocktails.map(c => `${c.name}: ${c.description}`).join('\n');

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: `Eres un asistente especializado en cocteles. Elige o adapta una receta de cóctel basandote en estas opciones:\n\n ${cocktailOptions} \n` },
                {
                    role: 'user',
                    content: `Quiero un cóctel ${flavor} y ${type}.`
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