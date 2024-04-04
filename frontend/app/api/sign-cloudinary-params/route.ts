import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dgt9nvfjk",
  api_key: "579894584877871",
  api_secret: "necj_D6QoIay0MKJZ67GLyuvusc",
});

export async function POST(request: Request) {
  const body = await request.json();
  const { paramsToSign } = body;

  const signature = cloudinary.utils.api_sign_request(paramsToSign, "necj_D6QoIay0MKJZ67GLyuvusc");

  return Response.json({ signature });
}
