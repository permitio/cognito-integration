import { CognitoJwtVerifier } from "aws-jwt-verify";
import express from "express";
import { Permit } from "permitio";

// Load environment variables from .env file if present for mjs 
import dotenv from "dotenv";
dotenv.config();
const clientId = process.env.CLIENT_ID;
const userPoolId = process.env.USER_POOL_ID;
const permitToken = process.env.PERMIT_TOKEN;


// Verifier that expects valid access tokens:
const verifier = CognitoJwtVerifier.create({
    userPoolId: userPoolId,
    tokenUse: "access",
    clientId: clientId,
});

// verifier for the id token:
const verifierIdToken = CognitoJwtVerifier.create({
    userPoolId: userPoolId,
    tokenUse: "id",
    clientId: clientId,
}
);

const permit = new Permit(
    {
        token: permitToken,
        pdp: "https://cloudpdp.api.permit.io",
    }
);

const app = express();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:8181");
    res.header("Access-Control-Allow-Headers", "Authorization");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});

app.get("/api/access", async (req, res) => {
    try {
        const payload = await verifier.verify(
            req.headers.authorization?.split(" ")[1] // the JWT as string
        );
        res.status(200).send(payload);
    } catch {
        res.status(403).send("Token not valid!");
    }
}
);

app.get("/api/id", async (req, res) => {
    try {
        const payload = await verifierIdToken.verify(
            req.headers.authorization?.split(" ")[1] // the JWT as string
        );
        res.status(200).send(payload);
    } catch {
        res.status(403).send("Token not valid!");
    }
}
);

app.post("/say_hello", async (req, res) => {
    try {
        const payload = await verifierIdToken.verify(
            req.headers.authorization?.split(" ")[1] // the JWT as string
        );
        // check the request body for the "message" property
        const permitted = await permit.check(
            payload.sub, // the user id
            "say", // the action
            "hello" // the resource
            );
        if (permitted) {
            res.status(200).send("Permitted! to say hello");
        } else {
            res.status(403).send("Not permitted to say hello");
        }
    }
    catch (error) {
        res.status(403).send("Token not valid!");
    }
});

app.post("/wave_hello", async (req, res) => {
    try {
        const payload = await verifierIdToken.verify(
            req.headers.authorization?.split(" ")[1] // the JWT as string
        );
        // check the request body for the "message" property
        const permitted = await permit.check(
            payload.sub, // the user id
            "wave", // the action
            "hello" // the resource
            );
        if (permitted) {
            res.status(200).send("Permitted! to say hello");
        } else {
            res.status(403).send("Not permitted to say hello");
        }
    }
    catch (error) {
        res.status(403).send("Token not valid!");
    }
});



app.post("/api/sync", async (req, res) => {
    try {
        const payload = await verifier.verify(
            req.headers.authorization?.split(" ")[1] // the JWT as string
        );
    } catch (error) {
        res.status(403).send("Token not valid!");
    }
    const syncUser = await permit.api.syncUser({
        "first_name": payload.name,
        "key": payload.sub,
        "email": payload.email,
    });
    // you can also assign role to a user here if you have mapping between Cognito groups and Permit roles
    // with the assign role SDK method
    // await permit.api.assignRole({
    //     "key": cognitoUser.sub,
    //     "role": caseSensitiveRoleKey,
    //     "tenant": caseSensitiveTenantKey, // if you don't use tenants, use 'default'
    // });
    res.status(200).send(syncUser);
}
);


// listen on port 8000 and reload on changes
app.listen(8000, () => {
    console.log("Server listening on port 8000");
}
);
// run with: npx nodemon index.mjs
