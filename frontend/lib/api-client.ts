// 全部のAPIクライアントはここに集約する
export const apiClient = async <T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        {
            headers: { "Content-Type": "applocation/json" },
            ...options,
        }
    )
    if (!res.ok) throw new Error("API Error")

    return res.json()
}