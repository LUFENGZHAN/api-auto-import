export default function apiAutoImport(config:Object) {
    return {
        name: 'api-auto-import',
        configureServer(server: any) {
            console.log('Vite server is starting up!', server);
        },
    };
}