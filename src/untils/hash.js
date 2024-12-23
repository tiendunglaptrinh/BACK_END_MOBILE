import bcrypt from "bcrypt";

const HashPassword = async (password, round) => {
  try {
    if (!password || typeof password !== "string" || password.trim() === "") {
      throw new Error("Password is invalid");
    }
    const salt = await bcrypt.genSalt(round);
    console.log("Generated salt:", salt);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
};

const CompareHash = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error("Error comparing password:", error);
    throw error;
  }
};

export { HashPassword, CompareHash };
