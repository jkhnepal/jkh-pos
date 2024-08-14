import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: "dgnd6ay3m",
//   api_key: "965714451628497",
//   api_secret: "1BJfl7LcXr2dABhwfX8khpxiHbs",
// });

cloudinary.config({
  cloud_name: "duv0sr2ua",
  api_key: "457615813374964",
  api_secret: "36Ul4B5-9KAuBnsQBVAqr4MB2d0",
});

// export async function POST(request: Request) {
//   const body = await request.json();
//   const { paramsToSign } = body;
//   const signature = cloudinary.utils.api_sign_request(paramsToSign, "rXZJIvoFw1FsS708gdAX8YrhCWI");
//   return Response.json({ signature });
// }
