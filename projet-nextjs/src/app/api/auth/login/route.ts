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
      return new Response(JSON.stringify({ error: "Email ou mot de passe incorrect" }), { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ error: "Email ou mot de passe incorrect" }), { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, nom: user.nom, prenom: user.prenom },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return new Response(JSON.stringify({
      token,
      role: user.role,
      nom: user.nom,
      prenom: user.prenom
    }), { status: 200, headers: { "Content-Type": "application/json" }});

  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message || "Erreur serveur" }), { status: 500 });
  }
}
