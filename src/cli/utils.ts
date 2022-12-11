import inquirer, {QuestionCollection} from "inquirer";

export async function askToUserConfirm() {
    const questions: QuestionCollection = [
        {
            type: 'input',
            name: 'confirm',
            choices: ['y', 'n'],
            message: 'Confirm? [y/N]',
            default: 'n',
        },
    ];

    const data = (await inquirer.prompt(questions)) as {
        confirm: 'y' | 'n';
    };
    return data.confirm == 'y';
}
