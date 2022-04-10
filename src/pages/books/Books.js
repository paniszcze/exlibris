import BookList from "../../components/BookList";

const documents = [
  {
    id: 0,
    entry: {
      title: "Zrolowany wrześniowy Vogue",
      subtitle: "",
      authors: ["Jarek Skurzyński"],
      translators: [],
      editors: [],
      publisher: "Korporacja Ha!art",
      year: "2020",
      place: "Kraków",
      edition: "Wydanie I.",
      series: ["Seria prozatorska"],
      info: "",
      tags: ["proza", "powieść obyczajowa", "LGBTQ"],
    },
    catalogue: {
      id: "2020",
      record: "2020/2134",
    },
    notes: [
      {
        id: 1,
        date: "20 września 2021",
        content:
          "Anim cupidatat ut cupidatat sint proident in nisi esse minim excepteur commodo. Lorem excepteur tempor enim elit fugiat in irure. Cillum magna Lorem id dolor amet occaecat culpa irure exercitation.",
      },
      {
        id: 2,
        date: "2 lutego 2022",
        content:
          "Occaecat deserunt aute occaecat elit Lorem ullamco consequat dolore enim ipsum. Amet officia labore est dolor fugiat aliquip anim mollit aute ipsum minim.",
      },
    ],
  },
  {
    id: 2,
    entry: {
      title: "Jedenaście medytacji nad istnieniem dzieła sztuki",
      subtitle: "Eseje",
      authors: ["Jarek Skurzyński"],
      translators: [],
      editors: [],
      publisher: "Wydawnictwo Naukowe Katedra",
      year: "2021",
      place: "Gdańsk",
      edition: "Wydanie I.",
      series: [],
      info: "",
      tags: ["esej", "filozofia", "teoria sztuki"],
    },
    catalogue: {
      id: "2021",
      record: "2021/2891",
    },
    notes: [
      {
        id: 1,
        date: "20 września 2021",
        content:
          "Cillum magna Lorem id dolor amet occaecat culpa irure exercitation. Amet officia labore est dolor fugiat aliquip anim mollit aute ipsum minim.",
      },
    ],
  },
];

export default function Books() {
  return (
    <div>
      <h2 className="page-title">Moje książki</h2>
      {document && <BookList books={documents} />}
    </div>
  );
}
