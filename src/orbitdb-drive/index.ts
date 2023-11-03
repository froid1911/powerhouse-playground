import { create } from "ipfs-core";
// @ts-ignore
import { createOrbitDB } from "@orbitdb/core";
import DocumentDrive from "document-model-libs/document-drive";

const defaultData = DocumentDrive.utils.createDocument({
    name: "My Local Drives",
    state: {
        drives: [
            {
                id: "123",
                name: "Local Device",
                hash: "test",
                nodes: [
                    {
                        name: "Document Models",
                        path: "Document Models",
                        hash: "folder",
                        kind: "folder",
                    },
                    {
                        name: "Address Book",
                        path: "Document Models/addressBook.phdm.zip",
                        hash: "Address Book",
                        kind: "file",
                        documentType: "powerhouse/document-model",
                    },
                    {
                        name: "Document Drive",
                        path: "Document Models/documentDrive.phdm.zip",
                        hash: "Document Drive",
                        kind: "file",
                        documentType: "powerhouse/document-model",
                    },
                    {
                        name: "Document Editor",
                        path: "Document Models/documentEditor.phdm.zip",
                        hash: "Document Editor",
                        kind: "file",
                        documentType: "powerhouse/document-model",
                    },
                ],
            },
        ],
    },
});

const instance = new DocumentDrive.DocumentDrive({
    name: "My Local Drives",
    state: {
        drives: [
            {
                id: "123",
                name: "Local Device",
                hash: "test",
                nodes: [
                    {
                        name: "Document Models",
                        path: "Document Models",
                        hash: "folder",
                        kind: "folder",
                    },
                    {
                        name: "Address Book",
                        path: "Document Models/addressBook.phdm.zip",
                        hash: "Address Book",
                        kind: "file",
                        documentType: "powerhouse/document-model",
                    },
                    {
                        name: "Document Drive",
                        path: "Document Models/documentDrive.phdm.zip",
                        hash: "Document Drive",
                        kind: "file",
                        documentType: "powerhouse/document-model",
                    },
                    {
                        name: "Document Editor",
                        path: "Document Models/documentEditor.phdm.zip",
                        hash: "Document Editor",
                        kind: "file",
                        documentType: "powerhouse/document-model",
                    },
                ],
            },
        ],
    },
});

export const main = async () => {
    const name = "connect-drive-test";
    // init ipfs and orbitdb
    const ipfs = await create();
    const orbitdb = await createOrbitDB({ ipfs });
    const db = await orbitdb.open(name, { type: "keyvalue" });
    const {
        address,
        identity: { id },
    } = db;

    // create root node if not existing
    let root = await db.get("/");
    if (!root) {
        console.log("Creating root node");
        await db.put("/", defaultData);
        root = await db.get("/");
    }

    const add = async (path, kind, name) => {
        const entry = {
            name,
            path: path + "/" + name,
            hash: "folder",
            kind,
        };
        root.state.drives[0].nodes.push(entry);
        await db.put("/", root);
    };

    await add("Document Models", "folder", "Document Models new");
    await add(
        "Document Models/Document Models new",
        "file",
        "Orbit Document Drive v2"
    );

    const remove = async (path) => {
        root.state.drives[0].nodes = root.state.drives[0].nodes.filter(
            (n) => n.path !== path
        );
        await db.put("/", root);
    };

    await remove("Document Models/documentDrive.phdm.zip");

    console.log(root.state.drives[0].nodes);

    await db.close();
    await orbitdb.stop();

    return { address, name, id, localDrive: root.state.drives[0].nodes };
};

main().then(console.log).catch(console.error);
