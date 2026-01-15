import { Redis } from "ioredis";
import configs from "../configs/index.configs.js";

const redis = new Redis({
    host: configs.REDIS_HOST,
    port: configs.REDIS_PORT,
    password: configs.REDIS_PASSWORD,
});

export default redis;