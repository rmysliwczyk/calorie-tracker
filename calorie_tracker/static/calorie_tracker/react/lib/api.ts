export async function getUserProfile(userId: number = null): Promise<User> {
    try {
        const response = await fetch(`api/userprofiles/${userId}`);
        return await response.json();
    }
    catch (error) {
        return {
            username: null,
            calorie_goal: null,
            error_message: error
        }
    }
}