import prisma from "../config/prisma.js"

// Mapeo común para tolerar tildes en especialidades (e.g., Cardiologia <-> Cardiología)
function getSpecialtyVariants(name: string): string[] {
  const clean = name.trim()
  const accentsMap: Record<string, string> = {
    cardiologia: "Cardiología",
    pediatria: "Pediatría",
    dermatologia: "Dermatología",
    neurologia: "Neurología",
    oftalmologia: "Oftalmología",
    traumatologia: "Traumatología",
    ginecologia: "Ginecología",
    urologia: "Urología"
  }
  const key = clean.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  const withAccent = accentsMap[key]

  const variants = [clean]
  if (withAccent && withAccent.toLowerCase() !== clean.toLowerCase()) {
    variants.push(withAccent)
  }
  return variants
}

export const getAllDoctors = async (specialtyName?: string) => {
  let whereClause = undefined

  if (specialtyName) {
    const variants = getSpecialtyVariants(specialtyName)
    whereClause = {
      especialidad: {
        OR: variants.map((v) => ({
          nombre: {
            equals: v,
            mode: "insensitive" as const
          }
        }))
      }
    }
  }

  return await prisma.medico.findMany({
    where: whereClause,
    include: {
      especialidad: true
    },
    orderBy: {
      id: "asc"
    }
  })
}

export const getDoctorById = async (id: number) => {
  return await prisma.medico.findUnique({
    where: {
      id
    },
    include: {
      especialidad: true
    }
  })
}
