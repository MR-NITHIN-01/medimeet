import { getAllDoctors } from "@/actions/doctor"; // we'll define this next
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function AllDoctorsPage() {
  // Fetch all verified doctors
  const doctors = await getAllDoctors();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-emerald-500 mb-8 text-center">
        All Verified Doctors
      </h1>

      {doctors.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No verified doctors found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="border-emerald-900/30 bg-muted/10 hover:border-emerald-700/30 transition-all"
            >
              <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted">
                    <Image
                      src={doctor.imageUrl || "/default-avatar.png"}
                      alt={doctor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {doctor.specialty} • {doctor.experience} years experience
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    {doctor.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <Button
                      asChild
                      className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
                    >
                      <Link href={`/doctors/${doctor.id}`}>
                        <CalendarDays className="h-4 w-4 mr-2" />
                        View Profile & Book
                      </Link>
                    </Button>
                    <Badge
                      variant="outline"
                      className="text-emerald-400 border-emerald-700/40 bg-emerald-900/20"
                    >
                      Verified
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
