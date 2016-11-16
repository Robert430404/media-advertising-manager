<?php

namespace AppBundle\Command;

use Carbon\Carbon;
use AppBundle\Entity\Users;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class AppCreateUserTestCommand extends ContainerAwareCommand
{
    /**
     * This configures the command and assigns descriptors and arguments
     */
    protected function configure()
    {
        $this
            ->setName('app:create:user:test')
            ->setDescription('Creates Test User');
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
        $user            = new Users();
        $encoder         = $this->getContainer()->get('security.password_encoder');
        $password        = 'password';
        $encodedPassword = $encoder->encodePassword($user, $password);

        $user->setUsername('test_user');
        $user->setPassword($encodedPassword);
        $user->setEmailAddress('test@example.com');
        $user->setUserRole('USER_ROLE');
        $user->setFullName('Test Testerson');
        $user->setCreatedAt(Carbon::now());
        $user->setUpdatedAt(Carbon::now());

        $orm = $this->getContainer()->get('doctrine')->getManager();
        $orm->persist($user);
        $orm->flush();

        $output->writeln([
            '',
            'Test user has been created',
            ''
        ]);
    }

}
