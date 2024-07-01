import SkillCard from '/components/SkillCard.js';

const skills = ['html', 'css', 'js', 'nodejs', 'python', 'vscode', 'git', 'linux', 'docker'];

/**
 * @param {Document} content
 */
export function init(content)
{   
    /**@type {HTMLDivElement} */
    const divSkills = document.querySelector('.skills-grid');

    skills.forEach(skill =>
    {
        divSkills.append(new SkillCard(skill));
    });
}
