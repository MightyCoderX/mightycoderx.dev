import SkillCard from '/components/SkillCard.js';

/**
 * @param {Document} content
 */

const skills = ['html', 'css', 'js', 'nodejs', 'python', 'c', 'vscode', 'github'];

export function init(content)
{   
    /**@type {HTMLDivElement} */
    const divSkills = document.querySelector('.skills-grid');

    skills.forEach(skill =>
    {
        divSkills.append(new SkillCard(skill));
    });
}
