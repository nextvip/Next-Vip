import { supabase } from "./supabase.js";

const verifyConnection = async () => {
  const { error } = await supabase.from("users").select("id").limit(1);

  if (error) {
    if (error.code === "PGRST205" || error.message?.includes("does not exist")) {
      console.warn(
        "Supabase connected, but tables are missing. Run server/supabase/schema.sql in the Supabase SQL editor."
      );
      return;
    }
    console.error("Supabase connection error:", error.message);
    return;
  }

  console.log("Supabase database connected successfully");
};

verifyConnection();

export default supabase;
