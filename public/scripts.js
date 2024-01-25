document.getElementById('saveAvatar').addEventListener('click', function () {
    const selectedAvatar = document.querySelector('.avatar-option:checked');
    if (selectedAvatar) {
        const avatarImg = document.querySelector('.card-img-top');
        avatarImg.src = selectedAvatar.value;
    }
    $('#avatarModal').modal('hide');
});