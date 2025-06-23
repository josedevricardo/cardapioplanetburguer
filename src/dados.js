const produtos = [
  {
    id: 1,
    nome: "Hamburguer",
    descricao: "Hamburguer batata milho salada saboroso no capricho",
    preco: 14.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
   
  },

  {
    id: 2,
    nome: "X-Burguer",
    descricao: "Hamburguer mussarela batata milho salada no capricho",
    preco: 15.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
    
  },

  {
    id: 3,
    nome: "X-Burguer-Egg",
    descricao: "Hamburguer ovo mussurela batata milho salada",
    preco: 16.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
    
  },

  {
    id: 4,
    nome: "X-Bacon",
    descricao: "Hamburguer mussarela bacon batata milho salada",
    preco: 17.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
    
  },

  {
    id: 5,
    nome: "X-Bacon-Egg",
    descricao: "Hamburguer mussarela bacon ovo batata milho salada",
    preco: 17.50,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 6,
    nome: "X-Black",
    descricao: "Hamburguer mussarela presunto bacon ovo milho salada",
    preco: 18.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 7,
    nome: "Bauru",
    descricao: "Presunto mussarela ovo batata milho salada saboroso",
    preco: 14.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 8,
    nome: "X-Frango",
    descricao: "Frango desfiado mussarela batata milho salada",
    preco: 15.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 9,
    nome: "Big Burguer",
    descricao: "2 Hamburguer mussarela salsicha batata saboroso milho salada",
    preco: 17.50,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 10,
    nome: "Calafrango",
    descricao: "Frango desfiado calabresa presunto mussarela batata milho",
    preco: 17.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 11,
    nome: "Misto Quente",
    descricao: "Presunto mussarela saboroso no capricho",
    preco: 9.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 12,
    nome: "Misto Especial",
    descricao: "Presunto mussarela batata saboroso",
    preco: 12.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 13,
    nome: "X-tudo",
    descricao:
      "carne frango desfiado calabresa ovo presunto mussarela salsicha bacon",
    preco: 21.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 14,
    nome: "Kikoko",
    descricao:
      "frango desfiado bacon presunto mussarela batata saboroso milho salada",
    preco: 17.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 15,
    nome: "Franburguer",
    descricao:
      "Frango desfiado presunto ovo mussarela batata saboroso milho salada",
    preco: 17.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 16,
    nome: "Marciano",
    descricao: "Carne de Hamburguer frango desfiado presunto batata saboroso",
    preco: 17.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 17,
    nome: "Americano",
    descricao:
      "Hamburguer bacon ovo calabresa presunto mussarela batata saboroso",
    preco: 19.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 18,
    nome: "Scooby",
    descricao:
      "Presunto mussarela bacon ovo salshicha batata saboroso milho salada",
    preco: 17.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 19,
    nome: "Burguinho",
    descricao: "Hamburguer ovo presunto mussarela batata saboroso milho salada",
    preco: 17.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 20,
    nome: "Galáxia",
    descricao: "2 carnes bacon ovo presunto mussarela salsicha batata saboroso",
    preco: 20.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 21,
    nome: "Marte",
    descricao:
      "2 carnes bacon ovo presunto mussarela frango salsicha batata saboroso",
    preco: 22.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 22,
    nome: "X-Planet",
    descricao:
      "2 carnes bacon,mussarela salsicha frango presunto ovo calabresa batata saboroso",
    preco: 23.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 23,
    nome: "Mata Fome",
    descricao:
      "2 carnes bacon 2 mussarela 2 salsicha frango presunto 2 ovos calabresa batata saboroso",
    preco: 24.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 24,
    nome: "X-Filé",
    descricao:
      "Filé mussarela ovo pesunto catupiry batata milho salada saboroso saboroso",
    preco: 20.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 25,
    nome: "Big Planet",
    descricao:
      "Hamburguer filé mignon bacon ovo presunto mussarela catupiry batata saboroso",
    preco: 21.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 26,
    nome: "Ducheff",
    descricao:
      "Hamburguer frango desfiado presunto mussarela ovo catupiry batata saboroso",
    preco: 19.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
  id: 27,
  nome: "Kikoko",
  descricao: "frango desfiado bacon presunto mussarela batata",
  preco: 17.0,
  foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
},

{
  id: 28,
  nome: "Franburguer",
  descricao: "Frango desfiado presunto ovo mussarela batata",
  preco: 17.0,
  foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
},

{
  id: 29,
  nome: "Marciano",
  descricao: "Carne de Hamburguer frango desfiado presunto batata",
  preco: 17.0,
  foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
},

{
  id: 30,
  nome: "Big Burguer",
  descricao: "2 Hamburguer mussarela salsicha batata",
  preco: 17.50,
  foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
},

{
  id: 31,
  nome: "Americano",
  descricao: "Hamburguer bacon ovo calabresa presunto mussarela batata",
  preco: 19.0,
  foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
},

{
  id: 32,
  nome: "Scooby",
  descricao: "Presunto mussarela bacon ovo salshicha batata",
  preco: 17.0,
  foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
},

{
  id: 33,
  nome: "Burguinho",
  descricao: "Hamburguer ovo presunto mussarela batata",
  preco: 17.0,
  foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
},

{
  id: 34,
  nome: "Galáxia",
  descricao: "2 carnes bacon ovo presunto mussarela salsicha batata",
  preco: 20.0,
  foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
},

{
  id: 35,
  nome: "Marte",
  descricao: "2 carnes bacon ovo presunto mussarela frango salsicha batata",
  preco: 22.0,
  foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
},

{
  id: 36,
  nome: "X-Planet",
  descricao:
    "2 carnes bacon,mussarela salsicha frango presunto ovo calabresa batata",
  preco: 23.0,
  foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
},

{
  id: 37,
  nome: "Big Planet",
  descricao:
    "Hamburguer filé mignon bacon ovo presunto mussarela catupiry batata",
  preco: 21.0,
  foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
},

{
  id: 38,
  nome: "Ducheff",
  descricao:
    "Hamburguer frango desfiado presunto mussarela ovo catupiry batata",
  preco: 19.0,
  foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
},

{
  id: 39,
  nome: "Misto Quente",
  descricao: "Presunto mussarela",
  preco: 9.0,
  foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
},

{
  id: 40,
  nome: "Misto Especial",
  descricao: "Presunto mussarela batata",
  preco: 12.0,
  foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
},

{
    id: 41,
    nome: "Salada Burguer Artesanal",
    descricao: "Hamburguer 140g mussarela",
    preco: 20.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 42,
    nome: "CheeseBurguer Esp",
    descricao: "hamburguer 140g mussarela ovo cebola barbecue",
    preco: 22.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 43,
    nome: "CheeseBacon Egg",
    descricao: "Hamburguer 140g 2 bacon crocanta mussarela ovo batata",
    preco: 23.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 44,
    nome: "Chicken e Bacon",
    descricao:
      "Hamburguer 140g frango desfiado 2 bacon chedoar mussarela pressunto cebola",
    preco: 25.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 45,
    nome: "Double Burguer Artesanal",
    descricao: "2 Hamburguer 140g 2 bacon pressunto barbecue e salada",
    preco: 25.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 46,
    nome: "Omelete Frango",
    descricao: "Recheado e saboroso",
    preco: 21.0,
    foto: "https://i.postimg.cc/fR04Spry/omelete-especial.png",
  },

  {
    id: 47,
    nome: "Omelete Presunto",
    descricao: "Recheado e saboroso",
    preco: 20.0,
    foto: "https://i.postimg.cc/fR04Spry/omelete-especial.png",
  },

  {
    id: 48,
    nome: "Omelete Calabresa",
    descricao: "Recheado e saboroso",
    preco: 20.0,
    foto: "https://i.postimg.cc/fR04Spry/omelete-especial.png",
  },

  {
    id: 49,
    nome: "Omelete Mussarela",
    descricao: "Recheado e saboroso",
    preco: 21.0,
    foto: "https://i.postimg.cc/fR04Spry/omelete-especial.png",
  },

  {
    id: 50,
    nome: "Omelete Bacon",
    descricao: "Recheado e saboroso",
    preco: 22.0,
    foto: "https://i.postimg.cc/fR04Spry/omelete-especial.png",
  },

  {
    id: 51,
    nome: "Omelete Especial",
    descricao: "frango bacon mussarela presunto",
    preco: 25.0,
    foto: "https://i.postimg.cc/fR04Spry/omelete-especial.png",
  },

  {
    id: 52,
    nome: "Skol Latão",
    descricao: "Latão",
    preco: 5.5,
    foto: "https://i.postimg.cc/3wpJrwGx/cervejas.png",
  },

  {
    id: 53,
    nome: "Brahma Latão",
    descricao: "Latão",
    preco: 6.0,
    foto: "https://i.postimg.cc/3wpJrwGx/cervejas.png",
  },

  {
    id: 54,
    nome: "Brahma Mega",
    descricao: "Mega",
    preco: 7.0,
    foto: "https://i.postimg.cc/3wpJrwGx/cervejas.png",
  },

  {
    id: 55,
    nome: "Antarctica",
    descricao: "Latão",
    preco: 5.5,
    foto: "https://i.ibb.co/5LzvhZY/cervejaantartica.jpg",
  },

  {
    id: 56,
    nome: "Sub-Zero Latão",
    descricao: "Latão",
    preco: 5.0,
    foto: "https://i.ibb.co/8mDQcjF/subzero.jpg",
  },

  {
    id: 57,
    nome: "Bohemia Latão",
    descricao: "Latão",
    preco: 5.5,
    foto: "https://i.ibb.co/JRFqdNx/bohemia.jpg",
  },

  {
    id: 58,
    nome: "Heineken 330 Ml",
    descricao: "Long Neck",
    preco: 8.0,
    foto: "https://i.ibb.co/1J821jxs/Heineken-330ml.png",
  },


  {
    id: 59,
    nome: "Heineken 473 Ml",
    descricao: "Latão",
    preco: 8.0,
    foto: "https://i.ibb.co/4gw4pPNf/Heineken-350ml.png",
  },


  {
    id: 60,
    nome: "Guarapan 2L",
    descricao: "2 litros",
    preco: 8.0,
    foto: "https://i.ibb.co/GPV23Vq/guarapan.jpg",
  },

  {
    id: 61,
    nome: "Fanta Laranja",
    descricao: "2 litros",
    preco: 9.0,
    foto: "https://i.ibb.co/H2JjngT/Fanta-Laranja.jpg",
  },

  {
    id: 62,
    nome: "Fanta Uva 2L",
    descricao: "2 Litros",
    preco: 9.0,
    foto: "https://i.ibb.co/JB0XTnY/fanta-uva.jpg",
  },

  {
    id: 63,
    nome: "Sprite 2L",
    descricao: "2 Litros",
    preco: 9.0,
    foto: "https://i.ibb.co/DzjFz4W/sprite.jpg",
  },

  {
    id: 64,
    nome: "Pepsi 2L",
    descricao: "2 Litros",
    preco: 9.0,
    foto: "https://i.ibb.co/xXt03nM/pepsi.jpg",
  },

  {
    id: 65,
    nome: "Mate Couro 1L",
    descricao: "1 Litro",
    preco: 7.0,
    foto: "https://i.ibb.co/5RSqfDZ/mate-e-couro.jpg",
  },

  {
    id: 66,
    nome: "Coca-Cola 1L",
    descricao: "1 Litro",
    preco: 9.0,
    foto: "https://i.ibb.co/Jn7g05X/coca.jpg",
  },

  {
    id: 67,
    nome: "Coca-Cola 2L",
    descricao: "2 Litros",
    preco: 13.0,
    foto: "https://i.ibb.co/Jn7g05X/coca.jpg",
  },

  {
    id: 68,
    nome: "Cola-Lata",
    descricao: "350Ml",
    preco: 6.0,
    foto: "https://i.ibb.co/Y2f1jxr/coca-lata.jpg",
  },

  {
    id: 69,
    nome: "Refri Mini",
    descricao: "200Ml Sabores",
    preco: 3.0,
    foto: "https://i.ibb.co/PNggVmX/refri-mini.jpg",
  },

  {
    id: 70,
    nome: "Agua Com Gás",
    descricao: "Com Gás",
    preco: 3.0,
    foto: "https://i.postimg.cc/zfSwbqZq/agua-com-gas-sem-gas.png",
  },

  {
    id: 71,
    nome: "Agua Sem Gás",
    descricao: "Sem Gás",
    preco: 2.5,
    foto: "https://i.postimg.cc/zfSwbqZq/agua-com-gas-sem-gas.png",
  },

  {
    id: 72,
    nome: "Suco Abacaxi",
    descricao: "Natural 300 Ml",
    preco: 8.0,
    foto: "https://i.postimg.cc/SNn13Y83/sucos-frutas.png",
  },

  {
    id: 73,
    nome: "Suco Abacaxi",
    descricao: "Natural 500 Ml",
    preco: 11.0,
    foto: "https://i.postimg.cc/SNn13Y83/sucos-frutas.png",
  },

  {
    id: 74,
    nome: "Suco Goiaba",
    descricao: "Natural 300 Ml",
    preco: 8.0,
    foto: "https://i.postimg.cc/SNn13Y83/sucos-frutas.png",
  },

  {
    id: 75,
    nome: "Suco Goiaba",
    descricao: "Natural 500 Ml",
    preco: 11.0,
    foto: "https://i.postimg.cc/SNn13Y83/sucos-frutas.png",
  },
  
  {
    id: 76,
    nome: "Baneston",
    descricao: "Natural 300 Ml",
    preco: 10.0,
    foto: "https://i.postimg.cc/SNn13Y83/sucos-frutas.png",
  },

  {
    id: 77,
    nome: "Baneston",
    descricao: "Natural 500 Ml",
    preco: 12.0,
    foto: "https://i.postimg.cc/SNn13Y83/sucos-frutas.png",
  },

  
  {
    id: 78,
    nome: "Suco Maracujá",
    descricao: "Natural 300 Ml",
    preco: 8.0,
    foto: "https://i.postimg.cc/SNn13Y83/sucos-frutas.png",
  },

  {
    id: 79,
    nome: "Suco Maracujá",
    descricao: "Natural 500 Ml",
    preco: 11.0,
    foto: "https://i.postimg.cc/SNn13Y83/sucos-frutas.png",
  },

  
  {
    id: 80,
    nome: "Suco Acerola",
    descricao: "Natural 300 Ml",
    preco: 8.0,
    foto: "https://i.postimg.cc/SNn13Y83/sucos-frutas.png",
  },

  {
    id: 81,
    nome: "Suco Acerola",
    descricao: "Natural 500 Ml",
    preco: 11.0,
    foto: "https://i.postimg.cc/SNn13Y83/sucos-frutas.png",
  },

  
  {
    id: 82,
    nome: "Suco Coquinho",
    descricao: "Natural 300 Ml",
    preco: 8.0,
    foto: "https://i.postimg.cc/SNn13Y83/sucos-frutas.png",
  },

  {
    id: 83,
    nome: "Suco Coquinho",
    descricao: "Natural 500 Ml",
    preco: 11.0,
    foto: "https://i.postimg.cc/SNn13Y83/sucos-frutas.png",
  },

  {
    id: 84,
    nome: "Vitaminas 300 Ml",
    descricao: "Natural 300 Ml",
    preco: 10.0,
    foto: "https://i.postimg.cc/SNn13Y83/sucos-frutas.png",
  },

  {
    id: 85,
    nome: "Vitaminas 500 Ml",
    descricao: "Natural 500 Ml",
    preco: 11.0,
    foto: "https://i.postimg.cc/SNn13Y83/sucos-frutas.png",
  },

  {
    id: 86,
    nome: "Açai 300 Ml",
    descricao: "Adicine os complementos",
    preco: 12.0,
    foto: "https://i.ibb.co/Q7pQkcL5/a-ai-planetburguer.png",
  },

  {
    id: 87,
    nome: "Açai 500 Ml",
    descricao: "Adicine os complementos",
    preco: 15.0,
    foto: "https://i.ibb.co/Q7pQkcL5/a-ai-planetburguer.png",
  },

  {
    id: 88,
    nome: "Açai 700 Ml",
    descricao: "Adicine os complementos",
    preco: 19.0,
    foto: "https://i.ibb.co/Q7pQkcL5/a-ai-planetburguer.png",
  },

  {
    id: 89,
    nome: "Açai 1 litro",
    descricao: "Adicine os complementos",
    preco: 28.0,
    foto: "https://i.ibb.co/Q7pQkcL5/a-ai-planetburguer.png",
  },


  
];

const produto2 = [
  {
    id: 90,
    nome: "Kikoko",
    descricao: "frango desfiado bacon presunto mussarela batata",
    preco: 17.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 91,
    nome: "Franburguer",
    descricao: "Frango desfiado presunto ovo mussarela batata",
    preco: 17.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 92,
    nome: "Marciano",
    descricao: "Carne de Hamburguer frango desfiado presunto batata",
    preco: 17.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 93,
    nome: "Big Burguer",
    descricao: "2 Hamburguer mussarela salsicha batata",
    preco: 17.5,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 94,
    nome: "Americano",
    descricao: "Hamburguer bacon ovo calabresa presunto mussarela batata",
    preco: 19.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 95,
    nome: "Scooby",
    descricao: "Presunto mussarela bacon ovo salshicha batata",
    preco: 17.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 96,
    nome: "Burguinho",
    descricao: "Hamburguer ovo presunto mussarela batata",
    preco: 17.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 97,
    nome: "Galáxia",
    descricao: "2 carnes bacon ovo presunto mussarela salsicha batata",
    preco: 20.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 98,
    nome: "Marte",
    descricao: "2 carnes bacon ovo presunto mussarela frango salsicha batata",
    preco: 22.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 99,
    nome: "X-Planet",
    descricao:
      "2 carnes bacon,mussarela salsicha frango presunto ovo calabresa batata",
    preco: 23.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 100,
    nome: "Mata Fome",
    descricao:
      "2 carnes bacon 2 mussarela 2 salsicha frango presunto 2 ovos calabresa batata",
    preco: 24.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 101,
    nome: "X-Filé",
    descricao: "Filé mussarela ovo pesunto catupiry batata milho salada",
    preco: 20.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 102,
    nome: "Big Planet",
    descricao:
      "Hamburguer filé mignon bacon ovo presunto mussarela catupiry batata",
    preco: 23.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 103,
    nome: "Ducheff",
    descricao:
      "Hamburguer frango desfiado presunto mussarela ovo catupiry batata",
    preco: 19.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 104,
    nome: "Misto Quente",
    descricao: "Presunto mussarela",
    preco: 9.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 105,
    nome: "Misto Especial",
    descricao: "Presunto mussarela batata",
    preco: 12.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },



  
];

const lanches = [
  {
    id: 106,
    nome: "Salada Burguer Artesanal",
    descricao: "Hamburguer 140g mussarela",
    preco: 20.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 107,
    nome: "CheeseBurguer Esp",
    descricao: "hamburguer 140g mussarela ovo cebola barbecue",
    preco: 22.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 108,
    nome: "CheeseBacon Egg",
    descricao: "Hamburguer 140g 2 bacon crocanta mussarela ovo batata",
    preco: 23.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 109,
    nome: "Chicken e Bacon",
    descricao:
      "Hamburguer 140g frango desfiado 2 bacon chedoar mussarela pressunto cebola",
    preco: 25.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },

  {
    id: 110,
    nome: "Double Burguer Artesanal",
    descricao: "2 Hamburguer 140g 2 bacon pressunto barbecue e salada",
    preco: 25.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
  },
];

const omeletes = [
  {
    id: 111,
    nome: "Omelete Frango",
    descricao: "Recheado e saboroso",
    preco: 21.0,
    foto: "https://i.postimg.cc/fR04Spry/omelete-especial.png",
  },

  {
    id: 112,
    nome: "Omelete Presunto",
    descricao: "Recheado e saboroso",
    preco: 20.0,
    foto: "https://i.postimg.cc/fR04Spry/omelete-especial.png",
  },

  {
    id: 113,
    nome: "Omelete Calabresa",
    descricao: "Recheado e saboroso",
    preco: 20.0,
    foto: "https://i.postimg.cc/fR04Spry/omelete-especial.png",
  },

  {
    id: 114,
    nome: "Omelete Mussarela",
    descricao: "Recheado e saboroso",
    preco: 21.0,
    foto: "https://i.postimg.cc/fR04Spry/omelete-especial.png",
  },

  {
    id: 115,
    nome: "Omelete Bacon saboroso",
    descricao: "Recheado e saboroso",
    preco: 22.0,
    foto: "https://i.postimg.cc/fR04Spry/omelete-especial.png",
  },

  {
    id: 116,
    nome: "Omelete Especial",
    descricao: "frango bacon mussarela presunto",
    preco: 25.0,
    foto: "https://i.postimg.cc/fR04Spry/omelete-especial.png",
  },
];

const bebidas = [
  {
    id: 117,
    nome: "Skol Latão",
    descricao: "Latão",
    preco: 5.5,
    foto: "https://i.postimg.cc/3wpJrwGx/cervejas.png",
  },

  {
    id: 118,
    nome: "Brahma Latão",
    descricao: "Latão",
    preco: 6.0,
    foto: "https://i.postimg.cc/3wpJrwGx/cervejas.png",
  },

  {
    id: 119,
    nome: "Brahma Mega",
    descricao: "Mega",
    preco: 7.0,
    foto: "https://i.postimg.cc/3wpJrwGx/cervejas.png",
  },

  {
    id: 120,
    nome: "Antarctica",
    descricao: "Latão",
    preco: 5.5,
    foto: "https://i.ibb.co/5LzvhZY/cervejaantartica.jpg",
  },

  {
    id: 121,
    nome: "Sub-Zero Latão",
    descricao: "Latão",
    preco: 5.0,
    foto: "https://i.ibb.co/8mDQcjF/subzero.jpg",
  },

  {
    id: 122,
    nome: "Bohemia Latão",
    descricao: "Latão",
    preco: 5.5,
    foto: "https://i.ibb.co/JRFqdNx/bohemia.jpg",
  },

  {
    id: 123,
    nome: "Heineken 330",
    descricao: "Long Neck",
    preco: 8.0,
    foto: "https://i.ibb.co/1J821jxs/Heineken-330ml.png",
  },

  {
    id: 124,
    nome: "Heineken 473",
    descricao: "Latão",
    preco: 8.0,
    foto: "https://i.ibb.co/4gw4pPNf/Heineken-350ml.png",
  },

  {
    id: 125,
    nome: "Guarapan 2L",
    descricao: "2 litros",
    preco: 9.0,
    foto: "https://i.ibb.co/GPV23Vq/guarapan.jpg",
  },

  {
    id: 126,
    nome: "Fanta Laranja",
    descricao: "2 litros",
    preco: 9.0,
    foto: "https://i.ibb.co/H2JjngT/Fanta-Laranja.jpg",
  },

  {
    id: 127,
    nome: "Fanta Uva 2L",
    descricao: "2 Litros",
    preco: 10.0,
    foto: "https://i.ibb.co/JB0XTnY/fanta-uva.jpg",
  },

  {
    id: 128,
    nome: "Sprite 2L",
    descricao: "2 Litros",
    preco: 10.0,
    foto: "https://i.ibb.co/DzjFz4W/sprite.jpg",
  },

  {
    id: 129,
    nome: "Pepsi 2L",
    descricao: "2 Litros",
    preco: 10.0,
    foto: "https://i.ibb.co/xXt03nM/pepsi.jpg",
  },

  {
    id: 130,
    nome: "Mate Couro 1L",
    descricao: "1 Litro",
    preco: 7.0,
    foto: "https://i.ibb.co/5RSqfDZ/mate-e-couro.jpg",
  },

  {
    id: 131,
    nome: "Coca-Cola 1L",
    descricao: "1 Litro",
    preco: 9.0,
    foto: "https://i.ibb.co/Jn7g05X/coca.jpg",
  },

  {
    id: 132,
    nome: "Coca-Cola 2L",
    descricao: "2 Litros",
    preco: 13.0,
    foto: "https://i.ibb.co/Jn7g05X/coca.jpg",
  },

  {
    id: 133,
    nome: "Cola-Lata",
    descricao: "350Ml",
    preco: 6.0,
    foto: "https://i.ibb.co/Y2f1jxr/coca-lata.jpg",
  },

  {
    id: 134,
    nome: "Refri Mini",
    descricao: "200Ml Sabores",
    preco: 3.0,
    foto: "https://i.ibb.co/PNggVmX/refri-mini.jpg",
  },

  {
    id: 135,
    nome: "Agua Com Gás",
    descricao: "Com Gás",
    preco: 2.5,
    foto: "https://i.postimg.cc/zfSwbqZq/agua-com-gas-sem-gas.png",
  },

  {
    id: 136,
    nome: "Agua Sem Gás",
    descricao: "Sem Gás",
    preco: 2.5,
    foto: "https://i.postimg.cc/zfSwbqZq/agua-com-gas-sem-gas.png",
  },
];

const sucos = [
  
  {
    id: 137,
    nome: "Suco Abacaxi",
    descricao: "Natural 300 Ml",
    preco: 8.0,
    foto: "https://i.postimg.cc/SNn13Y83/sucos-frutas.png",
  },

  {
    id: 138,
    nome: "Suco Abacaxi",
    descricao: "Natural 500 Ml",
    preco: 11.0,
    foto: "https://i.postimg.cc/SNn13Y83/sucos-frutas.png",
  },

  {
    id: 139,
    nome: "Suco Goiaba",
    descricao: "Natural 300 Ml",
    preco: 8.0,
    foto: "https://i.postimg.cc/SNn13Y83/sucos-frutas.png",
  },

  {
    id: 140,
    nome: "Suco Goiaba",
    descricao: "Natural 500 Ml",
    preco: 11.0,
    foto: "https://i.postimg.cc/SNn13Y83/sucos-frutas.png",
  },
  
  {
    id: 141,
    nome: "Baneston",
    descricao: "Natural 300 Ml",
    preco: 10.0,
    foto: "https://i.postimg.cc/SNn13Y83/sucos-frutas.png",
  },

  {
    id: 142,
    nome: "Baneston",
    descricao: "Natural 500 Ml",
    preco: 12.0,
    foto: "https://i.postimg.cc/SNn13Y83/sucos-frutas.png",
  },

  
  {
    id: 143,
    nome: "Suco Maracujá",
    descricao: "Natural 300 Ml",
    preco: 8.0,
    foto: "https://i.postimg.cc/SNn13Y83/sucos-frutas.png",
  },

  {
    id: 144,
    nome: "Suco Maracujá",
    descricao: "Natural 500 Ml",
    preco: 11.0,
    foto: "https://i.postimg.cc/SNn13Y83/sucos-frutas.png",
  },

  
  {
    id: 145,
    nome: "Suco Acerola",
    descricao: "Natural 300 Ml",
    preco: 8.0,
    foto: "https://i.postimg.cc/SNn13Y83/sucos-frutas.png",
  },

  {
    id: 146,
    nome: "Suco Acerola",
    descricao: "Natural 500 Ml",
    preco: 11.0,
    foto: "https://i.postimg.cc/SNn13Y83/sucos-frutas.png",
  },

  
  {
    id: 147,
    nome: "Suco Coquinho",
    descricao: "Natural 300 Ml",
    preco: 8.0,
    foto: "https://i.postimg.cc/SNn13Y83/sucos-frutas.png",
  },

  {
    id: 148,
    nome: "Suco Coquinho",
    descricao: "Natural 500 Ml",
    preco: 11.0,
    foto: "https://i.postimg.cc/SNn13Y83/sucos-frutas.png",
  },

  {
    id: 149,
    nome: "Vitamina 300Ml",
    descricao: "Natural 300 Ml",
    preco: 10.0,
    foto: "https://i.postimg.cc/SNn13Y83/sucos-frutas.png",
  },

  {
    id: 150,
    nome: "Vitamina 500Ml",
    descricao: "Natural 500 Ml",
    preco: 11.0,
    foto: "https://i.postimg.cc/SNn13Y83/sucos-frutas.png",
  },

];

const acrescimo = [
  {
    id: 151,
    nome: "Acréscimos Hamburguer",
    descricao: "Hamburguer",
    preco: 5.0,
    foto: "https://i.postimg.cc/bN5fWj5Y/logoicon.png",
  },

  {
    id: 152,
    nome: "Acréscimos Frango",
    descricao: "Frango",
    preco: 5.0,
    foto: "https://i.postimg.cc/bN5fWj5Y/logoicon.png",
  },

  {
    id: 153,
    nome: "Acréscimos Bacon",
    descricao: "Bacon",
    preco: 5.0,
    foto: "https://i.postimg.cc/bN5fWj5Y/logoicon.png",
  },

  {
    id: 154,
    nome: "Acréscimos Abacaxi",
    descricao: "Abacaxi",
    preco: 2.0,
    foto: "https://i.postimg.cc/bN5fWj5Y/logoicon.png",
  },

  {
    id: 155,
    nome: "Acréscimos Ovo",
    descricao: "Ovo",
    preco: 2.0,
    foto: "https://i.postimg.cc/bN5fWj5Y/logoicon.png",
  },
  {
    id: 156,
    nome: "Acréscimos Catupiry",
    descricao: "Catupiry",
    preco: 2.0,
    foto: "https://i.postimg.cc/bN5fWj5Y/logoicon.png",
  },

  {
    id: 157,
    nome: "Acréscimos Mussarela",
    descricao: "Mussarela",
    preco: 4.0,
    foto: "https://i.postimg.cc/bN5fWj5Y/logoicon.png",
  },

  {
    id: 158,
    nome: "Acréscimos Calabresa",
    descricao: "Calabresa",
    preco: 4.0,
    foto: "https://i.postimg.cc/bN5fWj5Y/logoicon.png",
  },

];
  const acai = [

  {
    id: 159,
    nome: "Açai 300 Ml",
    descricao: "Adicine os complementos",
    preco: 12.0,
    foto: "https://i.ibb.co/Q7pQkcL5/a-ai-planetburguer.png",
  },

  {
    id: 160,
    nome: "Açai 500 Ml",
    descricao: "Adicine os complementos",
    preco: 15.0,
    foto: "https://i.ibb.co/Q7pQkcL5/a-ai-planetburguer.png",
  },

  {
    id: 161,
    nome: "Açai 700 Ml",
    descricao: "Adicine os complementos",
    preco: 19.0,
    foto: "https://i.ibb.co/Q7pQkcL5/a-ai-planetburguer.png",
  },

  {
    id: 162,
    nome: "Açai 1 litro",
    descricao: "Adicine os complementos",
    preco: 28.0,
    foto: "https://i.ibb.co/Q7pQkcL5/a-ai-planetburguer.png",
  },


];

const carrinho = [
  {
    id: 1,
    nome: "X-tudo",
    preco: 17.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
    qtd: 2,
  },
  
  {
    id: 2,
    nome: "X-Salada",
    preco: 15.0,
    foto: "https://i.postimg.cc/nrb5dt2Q/hamburguer.png",
    qtd: 1,
  },
];

export {
  produtos,
  produto2,
  lanches,
  omeletes,
  bebidas,
  sucos,
  acrescimo,
  acai,
  carrinho,
};
