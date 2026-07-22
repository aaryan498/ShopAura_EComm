import { seconds, Throttle } from "@nestjs/throttler";

// For Payments and Authentication
export const StrictThrottle = () => 
    Throttle({
        default: {
            ttl: seconds(1000),
            limit: 3,
        },
    });


export const ModerateThrottle = () => 
    Throttle({
        default: {
            ttl: seconds(1000),
            limit: 5,
        }
    })

export const RelaxedThrottle = () => 
    Throttle({
        default: {
            ttl: seconds(1000),
            limit: 10,
        }
    })