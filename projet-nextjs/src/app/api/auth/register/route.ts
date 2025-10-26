import { dbConnect } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();

    // Récupérer les données depuis le body
    const { nom, prenom, email, password, role }: { 
      nom: string; 
      prenom: string; 
      email: string; 
      password: string; 
      role: "gynécologue" | "patiente"; 
    } = await req.json();

    // Vérifier que tous les champs sont remplis
    if (!nom || !prenom || !email || !password || !role) {
      return new Response(JSON.stringify({ error: "Tous les champs sont obligatoires" }), { status: 400 });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer et sauvegarder l'utilisateur
    const newUser = new User({
      nom,
      prenom,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    return new Response(JSON.stringify({ message: "User registered successfully", userId: newUser._id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message || "Something went wrong" }), { status: 500 });
  }
}
