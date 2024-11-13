import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { CircularProgress, Container } from "@mui/material";
import Clock from "./clock";
import { CardComponent } from "./card";
import type { Bus } from "./card";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const getTimetables = async () => {
    const base = baseURL;
    const query = "?source=app";
    const url = new URL(base + query);
    const response = await fetch(url);
    const data = await response.json();

    return data;
};

export default function BusTimetable() {
    const [OITKuzuha, setOITKuzuha] = React.useState<Bus[]>([]);
    const [OITNagao, setOITNagao] = React.useState<Bus[]>([]);
    const [OITHirakata, setOITHirakata] = React.useState<Bus[]>([]);

    React.useEffect(() => {
        const fetchTimetables = async () => {
            const data = await getTimetables();
            setOITKuzuha(data.BusTimetables["OIT-Kuzuha"]);
            setOITNagao(data.BusTimetables["OIT-Nagao"]);
            setOITHirakata(data.BusTimetables["OIT-Hirakata"]);
        };

        fetchTimetables();
        const fetchInterval = 70000; // 70秒
        const intervalId = setInterval(fetchTimetables, fetchInterval);

        // ページを5分おきにスーパーリロード
        const reloadInterval = 1 * 60 * 1000; // 1分
        const reloadId = setInterval(() => {
            window.location.reload();
        }, reloadInterval);

        return () => {
            clearInterval(intervalId);
            clearInterval(reloadId);
        };
    }, []);

    const renderBusList = (buses: Bus[], label: string) => {
        if (!buses || buses.length === 0) {
            return (
                <Box sx={{ width: "30%", mb: 2, textAlign: "center" }}>
                    <Typography variant="h6">{label}</Typography>
                    {buses?.length === 0 ? (
                        <Box>
                            <CircularProgress />
                            <Typography>
                                バスの情報を取得中です。10秒ほどお待ち下さい。
                            </Typography>
                        </Box>
                    ) : (
                        <Typography>バスの情報がありません。</Typography>
                    )}
                </Box>
            );
        }

        return (
            <Box sx={{ width: "30%", mb: 2 }}>
                <Typography variant="h6">{label}</Typography>
                {buses.map((bus: Bus) => (
                    <CardComponent
                        key={bus.Name} // ユニークな識別子を指定
                        BusStop={bus.BusStop}
                        Stand={bus.Stand}
                        Name={bus.Name}
                        IsSignal={bus.IsSignal}
                        OnTime={bus.OnTime}
                        EstimatedTime={bus.EstimatedTime}
                        MoreMinutes={bus.MoreMinutes}
                        DelayMinutes={bus.DelayMinutes}
                        System={bus.System}
                        Destination={bus.Destination}
                    />
                ))}
            </Box>
        );
    };

    return (
        <Container>
            <Box
                component="section"
                sx={{
                    mt: 2,
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Typography variant="h5" align="left">
                    <Clock />
                </Typography>
                <Typography variant="subtitle1" align="right">
                    にょまかかります!
                </Typography>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                    mt: 3,
                }}
            >
                {renderBusList(OITNagao, "OIT → 長尾")}
                {renderBusList(OITKuzuha, "OIT → 樟葉")}
                {renderBusList(OITHirakata, "OIT → 枚方")}
            </Box>
        </Container>
    );
}
