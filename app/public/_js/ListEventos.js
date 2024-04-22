export default {
    props: {
        eventos: Array
    },
    setup(props, {emit}) {
        const eventos = Vue.ref(props.eventos)
        function selecionar(evento) {
            this.$router.push('/detalhes/' + evento.id);
        }
        return {
            eventos,
            selecionar
        }
    },
    template: `
    <table class="table table-hover" style="margin: 0 auto; width: 40%;">
        <thead class="table-dark" >
            <tr >
                <th> Lista de eventos cadastrados</th> 
                <th></th>           
            </tr>
        </thead>
        <tbody>
            <tr v-for="evento of eventos">
            <td>{{evento.nome}} </td>
            <td><button class="btn btn-outline-secondary p-1" @click="selecionar(evento);">Selecionar</button></td>
            </tr>
        </tbody>
    </table>
    `
}