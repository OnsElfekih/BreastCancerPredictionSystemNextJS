import { dbConnect } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email, password, role }: { 
      email: string; 
      password: string; 
      role: "gynécologue" | "patiente" 
    } = await req.json();

    if (!email || !password || !role) {
      return new Response(JSON.stringify({ error: "Tous les champs sont obligatoires" }), { status: 400 });
    }

    // Vérifier l'utilisateur avec email et role
    const user = await User.findOne({ email, role });
    if (!user) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });

    // Générer le JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message || "Something went wrong" }), { status: 500 });
  }
}
