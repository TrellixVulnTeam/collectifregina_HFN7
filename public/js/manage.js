$(document).ready(() =>{
    $('.article-delete').click(function(e){
        const answer = confirm("Êtes-vous sûr de vouloir supprimer cet article ?");
            if(answer){

                $target = $(e.target);
                $.ajax({
                    type: 'DELETE',
                    url: `/articles/delete/${$target.attr('data-article-id')}`,
                    success: (response) => {
                        alert('Article deleted');
                        window.location.href='/'
                    },
                    error: (error) =>{
                        console.log(error);
                    }
                })
            }
        })

    $('.evenement-delete').click(function(e){
        const answer = confirm("Êtes-vous sûr de vouloir supprimer cet évènement ?");
            if(answer){

                $target = $(e.target);
                $.ajax({
                    type: 'DELETE',
                    url: `/evenements/delete/${$target.attr('data-evenement-id')}`,
                    success: (response) => {
                        alert('Evenement supprimé');
                        window.location.href='/'
                    },
                    error: (error) =>{
                        console.log(error);
                    }
                })
            }
        })

    $('.photo-delete').click(function(e){
        const answer = confirm("Êtes-vous sûr de vouloir supprimer cette photo ?");
            if(answer){

                $target = $(e.target);
                $.ajax({
                    type: 'DELETE',
                    url: `/galerie/delete/${$target.attr('data-photo-id')}`,
                    success: (response) => {
                        alert('Photo supprimée');
                        window.location.href='/'
                    },
                    error: (error) =>{
                        console.log(error);
                    }
                })
            }
        })
    });