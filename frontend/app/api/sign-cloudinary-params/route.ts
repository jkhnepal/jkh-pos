import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: "dgnd6ay3m",
//   api_key: "965714451628497",
//   api_secret: "1BJfl7LcXr2dABhwfX8khpxiHbs",
// });

cloudinary.config({
  cloud_name: "db9vimrao",
  api_key: "745115532881289",
  api_secret: "rXZJIvoFw1FsS708gdAX8YrhCWI",
});

// export async function POST(request: Request) {
//   const body = await request.json();
//   const { paramsToSign } = body;
//   const signature = cloudinary.utils.api_sign_request(paramsToSign, "rXZJIvoFw1FsS708gdAX8YrhCWI");
//   return Response.json({ signature });
// }
