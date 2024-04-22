export default {
    props: {
        eventos: Array
    },
    setup(props, {emit}) {
        const route = VueRouter.useRoute();
        let id = route.params.id;
        const evento = props.eventos.value.filter(e => { return e.id == id; })[0];
        return {
            evento
        }
    },
    template: `
    <h2 class="text-center">Detalhes</h2>
    <div class="row justify-content-center my-5">
        <div class="col">
            <article class="card text-center">
                <p>ID: {{evento.id}}</p>
                <p>Nome: {{evento.nome}}</p>
                <p>Lado: {{evento.lado}}</p>
                <p>Area: {{evento.area}}</p>
            </article>
        </div>
    </div>
    `
}