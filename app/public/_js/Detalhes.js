export default {
    props: {
        usuarios: Array
    },
    setup(props, {emit}) {
        const route = VueRouter.useRoute();
        let id = route.params.id;
        const usuario = props.usuarios.value.filter(e => { return e.id == id; })[0];
        return {
            usuario
        }
    },
    template: `
    <h2 class="text-center">Detalhes</h2>
    <div class="row justify-content-center my-5">
        <div class="col" :style="{ color: usuario.preco > 50 ? 'red' : 'green' }">
            <article class="card text-center">
                <p>ID: {{usuario.id}}</p>
                <p>Nome: {{usuario.nome}}</p>
                <p>Senha: {{usuario.senha}}</p>
                <p>Papel: {{usuario.papel_id}}</p>
            </article>
        </div>
    </div>
    `
}