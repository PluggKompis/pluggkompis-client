import { Link } from "react-router-dom";
import { BookOpen, Users, MapPin } from "lucide-react";

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Hitta gratis läxhjälp nära dig</h1>
        <p className="text-xl text-gray-600 mb-8">
          Vi samlar alla läxhjälpsplatser på ett ställe. Enkelt att hitta, enkelt att boka.
        </p>
        <Link
          to="/venues"
          className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary-700"
        >
          Börja söka
        </Link>
      </div>

      {/* Features */}
      <div className="grid md:grid-3 gap-8 max-w-5xl mx-auto">
        <div className="text-center">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="text-primary-600" size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Hitta nära dig</h3>
          <p className="text-gray-600">Sök läxhjälp på bibliotek och fritidsgårdar i ditt område</p>
        </div>

        <div className="text-center">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="text-primary-600" size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Boka enkelt</h3>
          <p className="text-gray-600">Se scheman och boka platser direkt online</p>
        </div>

        <div className="text-center">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-primary-600" size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Erfarna volontärer</h3>
          <p className="text-gray-600">Få hjälp av studenter, pensionärer och ämnesexperter</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
