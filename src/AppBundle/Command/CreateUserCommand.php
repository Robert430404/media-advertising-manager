<?php

namespace AppBundle\Command;

use Carbon\Carbon;
use AppBundle\Entity\Users;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\ConfirmationQuestion;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;

class CreateUserCommand extends ContainerAwareCommand
{
    /**
     * This configures the command and assigns descriptors and arguments
     */
    protected function configure()
    {
        $this->setName('app:create:user')
            ->setDescription('Creates User')
            ->setHelp('Creates a new user and persists it to database.')
            ->addArgument('username', InputArgument::REQUIRED, 'Username Of New User')
            ->addArgument('password', InputArgument::REQUIRED, 'Password Of New User')
            ->addArgument('email', InputArgument::REQUIRED, 'Email Of New User')
            ->addArgument('user_role', InputArgument::REQUIRED, 'Set User Role')
            ->addArgument('first_name', InputArgument::REQUIRED, 'Full Name Of New User')
            ->addArgument('last_name', InputArgument::REQUIRED, 'Last Name Of New User');
    }

    /**
     * This command executes the command after confirmation
     *
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return string
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln([
            '',
            'User Creator',
            '============',
            'Username:  ' . $input->getArgument('username'),
            'Password:  ' . $input->getArgument('password'),
            'Email:     ' . $input->getArgument('email'),
            'Full Name: ' . $input->getArgument('first_name') . ' ' . $input->getArgument('last_name'),
            'User Role: ' . $input->getArgument('user_role'),
            ''
        ]);

        $helper = $this->getHelper('question');
        $question = new ConfirmationQuestion('Is the user information correct (y/n): ', false);

        if (!$helper->ask($input, $output, $question)) {
            return;
        }

        $user = new Users();

        $encoder = $this->getContainer()->get('security.password_encoder');
        $password = $input->getArgument('password');
        $encodedPassword = $encoder->encodePassword($user, $password);

        $user->setUsername($input->getArgument('username'));
        $user->setPassword($encodedPassword);
        $user->setEmailAddress($input->getArgument('email'));
        $user->setUserRole($input->getArgument('user_role'));
        $user->setFullName($input->getArgument('first_name') . ' ' . $input->getArgument('last_name'));
        $user->setCreatedAt(Carbon::now());
        $user->setUpdatedAt(Carbon::now());

        $orm = $this->getContainer()->get('doctrine')->getManager();
        $orm->persist($user);
        $orm->flush();

        $output->writeln([
            '',
            'User has been created',
            ''
        ]);
    }
}