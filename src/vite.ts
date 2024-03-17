export default function apiAutoImport(config:Object) {
    return {
        name: 'pulgin-api-auto-import',
        configureServer(server: any) {
            console.log('Vite server is starting up!', server);
        },
    };
}