import { GetServerSideProps } from "next";
import { getSession, useSession, signIn } from "next-auth/react";
import prisma from "../../db/db";
import {
  Therapist,
  Specialization,
  TherapySessionRequest,
} from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import axios from "axios";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";

const ResponsiveLine = dynamic(
  () => import("@nivo/line").then((mod) => mod.ResponsiveLine),
  { ssr: false }
);
const ResponsiveBar = dynamic(
  () => import("@nivo/bar").then((mod) => mod.ResponsiveBar),
  { ssr: false }
);
const ResponsiveScatterPlot = dynamic(
  () => import("@nivo/scatterplot").then((mod) => mod.ResponsiveScatterPlot),
  { ssr: false }
);
const ResponsivePie = dynamic(
  () => import("@nivo/pie").then((mod) => mod.ResponsivePie),
  { ssr: false }
);

interface TherapistWithSpecializations extends Therapist {
  specializations: Specialization[];
}

interface TherapistDashboardProps {
  therapist: TherapistWithSpecializations | null;
  initialPendingRequests: TherapySessionRequest[];
}

export default function TherapistDashboard({
  therapist,
  initialPendingRequests,
}: TherapistDashboardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pendingRequests, setPendingRequests] = useState(
    initialPendingRequests
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn(undefined, { callbackUrl: router.asPath });
    }
  }, [status, router]);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get<TherapySessionRequest[]>(
          "/api/therapy-session-requests"
        );
        console.log("Fetched requests:", response.data);
        // Filter requests for the current therapist
        const filteredRequests = response.data.filter(
          (req) => therapist && req.therapistId === therapist.id
        );
        setPendingRequests(filteredRequests);
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
    };

    fetchPendingRequests();
    const interval = setInterval(fetchPendingRequests, 5000);

    return () => clearInterval(interval);
  }, [therapist]);

  const handleRequestResponse = async (
    requestId: string,
    status: "ACCEPTED" | "REJECTED"
  ) => {
    try {
      await axios.put("/api/therapy-session-requests", {
        id: requestId,
        status,
      });

      // Remove the request from the list regardless of the status
      setPendingRequests((prevRequests) =>
        prevRequests.filter((req) => req.id !== requestId)
      );

      if (status === "ACCEPTED") {
        router.push(`/Talknow/Session?sessionId=${requestId}`);
      }
    } catch (error) {
      console.error("Error updating request status:", error);
      alert("Failed to update request status. Please try again.");
    }
  };

  // Add this log to see when the state updates
  console.log("Current pending requests:", pendingRequests);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in to access the dashboard.</div>;
  }

  if (!therapist) {
    return (
      <div>Therapist information not found. Please complete your profile.</div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <header className="flex items-center h-16 px-6 border-b bg-card">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">Welcome, {therapist.fullName}</h1>
          <div className="text-sm text-muted-foreground">
            Type: {therapist.type} | Specializations:{" "}
            {therapist.specializations.map((s) => s.name).join(", ")}
          </div>
        </div>
      </header>
      <main className="flex-1 p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Pending Session Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <p>No pending requests</p>
            ) : (
              <ul>
                {pendingRequests.map((request) => (
                  <li key={request.id} className="mb-4">
                    <p>
                      Requested at:{" "}
                      {new Date(request.requestedAt).toLocaleString()}
                    </p>
                    <button
                      onClick={() =>
                        handleRequestResponse(request.id, "ACCEPTED")
                      }
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        handleRequestResponse(request.id, "REJECTED")
                      }
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Reject
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Patient Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart className="w-full aspect-[4/3]" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Appointment Scheduling</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart className="w-full aspect-[4/3]" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Patient Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <DotChart className="w-full aspect-square" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Referral Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart className="w-full aspect-square" />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<
  TherapistDashboardProps
> = async (context) => {
  const session = await getSession(context);

  if (!session || !session.user || !session.user.id) {
    return {
      redirect: {
        destination:
          "/api/auth/signin?callbackUrl=" +
          encodeURIComponent(context.resolvedUrl),
        permanent: false,
      },
    };
  }

  const therapist = await prisma.therapist.findUnique({
    where: { userId: session.user.id },
    include: { specializations: true },
  });

  if (!therapist) {
    return {
      redirect: {
        destination: "/TherapistApply",
        permanent: false,
      },
    };
  }

  const pendingRequests = await prisma.therapySessionRequest.findMany({
    where: {
      therapistId: therapist.id,
      status: "PENDING",
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return {
    props: {
      therapist: JSON.parse(JSON.stringify(therapist)),
      initialPendingRequests: JSON.parse(JSON.stringify(pendingRequests)),
    },
  };
};

// Chart components
function BarChart(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      <ResponsiveBar
        data={[
          { name: "Jan", count: 111 },
          { name: "Feb", count: 157 },
          { name: "Mar", count: 129 },
          { name: "Apr", count: 150 },
          { name: "May", count: 119 },
          { name: "Jun", count: 72 },
        ]}
        keys={["count"]}
        indexBy="name"
        margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
        padding={0.3}
        colors={["#2563eb"]}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 4,
          tickPadding: 16,
        }}
        gridYValues={4}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        tooltipLabel={({ id }) => `${id}`}
        enableLabel={false}
        role="application"
        ariaLabel="A bar chart showing data"
      />
    </div>
  );
}

function DotChart(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      <ResponsiveScatterPlot
        data={[
          {
            id: "Desktop",
            data: [
              { x: "Jan", y: 43 },
              { x: "Feb", y: 137 },
              { x: "Mar", y: 61 },
              { x: "Apr", y: 145 },
              { x: "May", y: 26 },
              { x: "Jun", y: 154 },
            ],
          },
          {
            id: "Mobile",
            data: [
              { x: "Jan", y: 60 },
              { x: "Feb", y: 48 },
              { x: "Mar", y: 177 },
              { x: "Apr", y: 78 },
              { x: "May", y: 96 },
              { x: "Jun", y: 204 },
            ],
          },
        ]}
        margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
        xScale={{ type: "point" }}
        yScale={{ type: "linear" }}
        blendMode="multiply"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 5,
          tickPadding: 16,
        }}
        colors={["#2563eb", "#e11d48"]}
        useMesh={true}
        gridYValues={6}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        role="application"
      />
    </div>
  );
}

function LineChart(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      <ResponsiveLine
        data={[
          {
            id: "Desktop",
            data: [
              { x: "Jan", y: 43 },
              { x: "Feb", y: 137 },
              { x: "Mar", y: 61 },
              { x: "Apr", y: 145 },
              { x: "May", y: 26 },
              { x: "Jun", y: 154 },
            ],
          },
          {
            id: "Mobile",
            data: [
              { x: "Jan", y: 60 },
              { x: "Feb", y: 48 },
              { x: "Mar", y: 177 },
              { x: "Apr", y: 78 },
              { x: "May", y: 96 },
              { x: "Jun", y: 204 },
            ],
          },
        ]}
        curve="natural"
        margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
        xScale={{ type: "point" }}
        yScale={{ type: "linear", stacked: true }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 5,
          tickPadding: 16,
        }}
        colors={["#2563eb", "#e11d48"]}
        enableGridX={false}
        enablePoints={true}
        enableArea={true}
        areaOpacity={0.1}
        useMesh={true}
        gridYValues={6}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        role="application"
      />
    </div>
  );
}

function PieChart(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      <ResponsivePie
        data={
          [
            { id: "Source A", value: 40 },
            { id: "Source B", value: 30 },
            { id: "Source C", value: 20 },
            { id: "Source D", value: 10 },
          ] as any
        }
        margin={{ top: 10, right: 10, bottom: 40, left: 10 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        colors={["#2563eb", "#e11d48", "#16a34a", "#f59e0b"]}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
        }}
        role="application"
        arcLabel="A pie chart showing data"
      />
    </div>
  );
}
