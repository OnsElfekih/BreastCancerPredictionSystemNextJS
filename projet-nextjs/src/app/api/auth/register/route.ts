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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ nom, prenom, email, password: hashedPassword, role });
    await newUser.save();

    return new Response(JSON.stringify({
      message: "User registered successfully",
      userId: newUser._id,
      nom: newUser.nom,
      prenom: newUser.prenom,
      role: newUser.role
    }), { status: 201, headers: { "Content-Type": "application/json" }});
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message || "Erreur serveur" }), { status: 500 });
  }
}
