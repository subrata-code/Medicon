import redis from "./client.js";
import figlet from "figlet";

const connectRedis = () => {
    // Connect Redis...
    redis.on("connect", () => {
        // console.log("Redis connected successfully");
        figlet(
            "R e d i s   c o n n e c t e d  ! ✅✅✅",
            (err, data) => {
                if (err) {
                    console.log("Something went wrong in figlet...");
                    return;
                }
                console.log(data);
            }
        );
    });
    redis.on("error", (err) => {
        // console.error("Redis connection error:", err);
        figlet(
            "E r r o r   t o   c o n n e c t  R e d i s  ! ❌❌❌",
            (err, data) => {
                if (err) {
                    console.log("Something went wrong in figlet...");
                    return;
                }
                console.log(data);
            }
        );
    }
    );
    redis.on("ready", () => {
        // console.log("Redis is ready to use");
        figlet(
            "R e d i s   i s   r e a d y   t o   u s e  ! ✅✅✅",
            (err, data) => {
                if (err) {
                    console.log("Something went wrong in figlet...");
                    return;
                }
                console.log(data);
            }
        );
    }
    );
    redis.on("end", () => {
        // console.log("Redis connection closed");
        figlet(
            "R e d i s   c o n n e c t i o n   c l o s e d  ! ❌❌❌",
            (err, data) => {
                if (err) {
                    console.log("Something went wrong in figlet...");
                    return;
                }
                console.log(data);
            }
        );
    }
    );
    redis.on("reconnecting", () => {
        // console.log("Redis is reconnecting");
        figlet(
            "R e d i s   i s   r e c o n n e c t i n g  ! 🔄🔄🔄",
            (err, data) => {
                if (err) {
                    console.log("Something went wrong in figlet...");
                    return;
                }
                console.log(data);
            }
        );
    }
    );
    redis.on("close", () => {
        // console.log("Redis connection closed");
        figlet(
            "R e d i s   c o n n e c t i o n   c l o s e d  ! ❌❌❌",
            (err, data) => {
                if (err) {
                    console.log("Something went wrong in figlet...");
                    return;
                }
                console.log(data);
            }
        );
    }
    );
}

export default connectRedis;