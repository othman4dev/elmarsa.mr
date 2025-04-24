import "./AboutTeam.scss";
import { useTranslation } from "react-i18next";
import "../../locales/i18.js"; // Import the i18n config
const AboutTeam = () => {
  const { t, i18n } = useTranslation();

  const teamMembers = [
    {
      id: 1,
      name: t('name1'),
      role: t('role1'),
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: t('name2'),
      role: t('role2'),
      image: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      name: t('name3'),
      role: t('role3'),
      image: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      name: t('name4'),
      role: t('role4'),
      image: "https://via.placeholder.com/150",
    },
  ];
  return (
    <div className="aboutTeam">
      <h2>{t('our_core_team_member')}</h2>
      <div className="teams">
        {teamMembers.map((member) => {
          return (
            <div key={member.id} className="teamMember">
              <img src={member.image} alt={member.name} />

              <div className="info">
                <h3>{member.name}</h3>
                <span>{member.role}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AboutTeam;
