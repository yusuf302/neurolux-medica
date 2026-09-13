export async function GET() {
  return Response.json({
    ok: true,
    service: "NeuroLux Medica",
    mode: "production-ready foundation",
  });
}
