export default {
    props: {
        usuario: Object
    },
    template: `
    <div class="row justify-content-center my-5">
      <article class="card text-center">
        <p>{{usuario.nome}}</p>
        <p>{{usuario.senha}}</p>
        <p>{{usuario.papel_id}}</p>
      </article>
    </div>
    `
}