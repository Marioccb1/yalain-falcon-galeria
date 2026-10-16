renderGrid('#homeGrid', works.slice(0, 3));
$('#heroCanvas').innerHTML = artworkImgHTML(works[6]);
$('#heroCaption').textContent = `${works[6].titulo} · ${works[6].anio} · ${works[6].medidas}`;
$('#artistPreview').innerHTML = `<img src="${IMG.artistPreview}" alt="Retrato de Yalain Falcón Yanes en su taller" loading="lazy">`;
