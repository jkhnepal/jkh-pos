import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dgnd6ay3m",
  api_key: "965714451628497",
  api_secret: "1BJfl7LcXr2dABhwfX8khpxiHbs",
});

export async function POST(request: Request) {
  const body = await request.json();
  const { paramsToSign } = body;
  const signature = cloudinary.utils.api_sign_request(paramsToSign, "1BJfl7LcXr2dABhwfX8khpxiHbs");
  return Response.json({ signature });
}
