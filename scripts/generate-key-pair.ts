async function generateKey() {
    const keys = await crypto.subtle.generateKey("Ed25519", true, ["sign", "verify"])

    const privateKey = await crypto.subtle.exportKey("jwk", keys.privateKey)
    const publicKey = await crypto.subtle.exportKey("jwk", keys.publicKey)

    // const p2 = await crypto.subtle.importKey("jwk", privateKey, { name: "Ed25519" }, true, ["sign"])

    console.log({
        privateKey: btoa(JSON.stringify(privateKey)),
        publicKey: btoa(JSON.stringify(publicKey))
    })

    return keys
}

async function main() {
    const { privateKey, publicKey } = await generateKey()

    const data = "david"
    const encoded = new TextEncoder().encode(data)
    // const signature = await crypto.subtle.sign("ed25519", privateKey, encoded)

    // console.log(signature)
    // console.log(await crypto.subtle.verify("ed25519", publicKey, signature, encoded))
}


main()