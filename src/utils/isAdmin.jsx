// Check if the user is an admin
export default function isAdmin(user) {
    if (!user) {
        console.log("No user");
        return false;
    }

    const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "")
        .split(",")
        .map((s) => s.trim());
    return adminEmails.includes(user.email);
}
