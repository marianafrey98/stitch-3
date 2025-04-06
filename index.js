import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor Stitch funcionando 🚀");
});

app.post("/transferir", async (req, res) => {
  const { alias, monto } = req.body;

  try {
    const response = await axios.post(
      "https://api.mercadopago.com/v1/transfers",
      {
        transaction_amount: Number(monto),
        target: {
          type: "alias",
          value: alias
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ success: true, data: response.data });
  } catch (error) {
    const errMsg = error.response?.data || error.message || "Error desconocido";
    console.error("Error al transferir:", errMsg);
    res.status(500).json({ success: false, error: errMsg });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
