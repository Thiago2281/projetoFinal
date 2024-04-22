export default {
    props: {
        evento: Object
    },
    template: `
    <div class="row justify-content-center my-5">
      <article class="card text-center">
        <p>{{evento.nome}}</p>
        <p>{{evento.lado}}</p>
        <p>{{evento.area}}</p>
      </article>
    </div>
    `
}