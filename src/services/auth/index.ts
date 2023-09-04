export interface ILogin {
  username: string;
  password: string;
}

export const authentication = async (data: ILogin): Promise<any> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth`,
      {
        method: "POST",
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  } catch (error) {
    console.log(error)
  }

}
