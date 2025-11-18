import { dbConnect } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email, password, role } = await req.json();

    if (!email || !password || !role) {
      return new Response(JSON.stringify({ error: "Tous les champs sont obligatoires" }), { status: 400 });
    }

    const user = await User.findOne({ email, role });
    if (!user) {
      return new Response(JSON.stringify({ error: "Vérifiez vos données" }), { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return new Response(JSON.stringify({ error: "Email ou mot de passe incorrect" }), { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET non défini dans .env.local");
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        nom: user.nom,
        prenom: user.prenom
      },
      jwtSecret,
      { expiresIn: "1d" }
    );

    return new Response(
      JSON.stringify({ token, role: user.role, nom: user.nom, prenom: user.prenom }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (e: any) {
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}
