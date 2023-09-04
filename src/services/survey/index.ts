
interface Survey {
  id: string;
  fullName: string;
  identification: number;
  carModel: string;
  buyingFactors: string;
  drivingRating: number;
  satisfactionRating: number;
}
export const getSurveys = async (token: string): Promise<any> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/survey`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      }
    );
    return response.json();
  } catch (error) {
    console.log(error)
  }

}

export const getSurvey = async (id:string, token: string): Promise<any> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/survey/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      }
    );
    return await response;
  } catch (error) {
    console.log(error)
  }

}

export const createSurvey = async (data: Survey): Promise<any> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/survey`,
      {
        method: "POST",
        body: JSON.stringify({
          fullName: data.fullName,
          identification: data.identification,
          carModel: data.carModel,
          buyingFactors: data.buyingFactors,
          drivingRating: data.drivingRating,
          satisfactionRating: data.satisfactionRating,
        }),
        headers: {
          "Content-Type": "application/json"
        },
      }
    );
    return response.json();
  } catch (error) {
    console.log(error)
  }

}

export const updateSurvey = async (data: Survey, token: string): Promise<any> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/survey/${data.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          fullName: data.fullName,
          identification: data.identification,
          carModel: data.carModel,
          buyingFactors: data.buyingFactors,
          drivingRating: data.drivingRating,
          satisfactionRating: data.satisfactionRating,
        }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      }
    );
    return response.json();
  } catch (error) {
    console.log(error)
  }

}

export const deleteSurvey = async (id: string, token: string): Promise<any> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/survey/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      }
    );
    return response.json();
  } catch (error) {
    console.log(error)
  }

}
