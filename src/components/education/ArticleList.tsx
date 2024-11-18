import React, { useState } from 'react';
import { ChevronRight, Search, Tag } from 'lucide-react';
import ArticleViewer from './ArticleViewer';

const articles = [
  {
    id: 1,
    title: "Guide complet du brossage des dents",
    excerpt: "Apprenez les techniques correctes de brossage pour une hygiène optimale...",
    content: `Le brossage des dents est la base d'une bonne hygiène bucco-dentaire. Pour maintenir des dents saines et un sourire éclatant, il est essentiel de maîtriser la technique correcte.

    La technique recommandée :
    1. Placez votre brosse à dents à 45 degrés contre la ligne des gencives
    2. Brossez doucement avec des mouvements circulaires
    3. Nettoyez toutes les surfaces : extérieure, intérieure et surface de mastication
    4. N'oubliez pas de brosser votre langue

    Fréquence et durée :
    - Brossez-vous les dents au moins deux fois par jour
    - Chaque séance doit durer minimum 2 minutes
    - Idéalement, brossez après chaque repas

    Le choix du matériel est également crucial :
    - Optez pour une brosse à dents souple ou medium
    - Changez votre brosse tous les 3 mois
    - Utilisez un dentifrice fluoré adapté à vos besoins`,
    category: "Hygiène",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1570357321498-e6900b8e5f8a?auto=format&fit=crop&q=80",
    date: new Date().toISOString()
  },
  {
    id: 2,
    title: "Les aliments bons pour vos dents",
    excerpt: "Découvrez quels aliments peuvent renforcer votre santé dentaire...",
    content: `Une alimentation équilibrée joue un rôle crucial dans la santé bucco-dentaire. Certains aliments peuvent naturellement renforcer vos dents et protéger votre sourire.

    Aliments recommandés :
    - Produits laitiers : riches en calcium et en protéines
    - Fruits et légumes croquants : stimulent la production de salive
    - Noix et graines : sources de minéraux essentiels
    - Thé vert : contient des antioxydants bénéfiques

    Aliments à éviter :
    - Sucreries et sodas
    - Aliments très acides
    - Snacks collants
    
    Conseils pratiques :
    - Buvez beaucoup d'eau
    - Mangez des crudités en fin de repas
    - Évitez de grignoter entre les repas`,
    category: "Nutrition",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80",
    date: new Date().toISOString()
  },
  {
    id: 3,
    title: "Prévention des caries dentaires",
    excerpt: "Conseils pratiques pour prévenir les caries et maintenir une bonne santé bucco-dentaire...",
    content: `La prévention des caries est essentielle pour maintenir une bonne santé bucco-dentaire à long terme. Voici un guide complet pour protéger vos dents.

    Mesures préventives essentielles :
    1. Hygiène quotidienne rigoureuse
    2. Visites régulières chez le dentiste
    3. Alimentation équilibrée
    4. Utilisation de produits fluorés

    Signes d'alerte à surveiller :
    - Sensibilité aux aliments chauds ou froids
    - Douleurs persistantes
    - Taches sombres sur les dents
    
    Traitements préventifs recommandés :
    - Scellements dentaires
    - Applications de fluor
    - Détartrage régulier`,
    category: "Prévention",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80",
    date: new Date().toISOString()
  }
];

const categories = ["Tous", "Hygiène", "Nutrition", "Prévention", "Traitements"];

export default function ArticleList() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === "Tous" || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <div className="mb-20">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">Articles Éducatifs</h3>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Tag className="inline-block h-4 w-4 mr-1" />
                {category}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <article key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-600">{article.category}</span>
                  <span className="text-sm text-gray-500">{article.readTime} de lecture</span>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{article.title}</h4>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <button 
                  onClick={() => setSelectedArticle(article)}
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  Lire plus
                  <ChevronRight className="h-5 w-5 ml-1" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selectedArticle && (
        <ArticleViewer
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </>
  );
}