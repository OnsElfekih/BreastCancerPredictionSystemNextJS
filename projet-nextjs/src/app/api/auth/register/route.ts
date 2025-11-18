import { dbConnect } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { nom, prenom, email, password, role } = await req.json();

    if (!nom || !prenom || !email || !password || !role) {
      return new Response(JSON.stringify({ error: "Tous les champs sont obligatoires" }), { status: 400 });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return new Response(JSON.stringify({ error: "Email déjà utilisé" }), { status: 400 });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      nom,
      prenom,
      email,
      password: hash,
      role
    });

    return new Response(
      JSON.stringify({
        message: "Utilisateur créé",
        userId: user._id,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );

  } catch (e: any) {
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}
