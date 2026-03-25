use anchor_lang::prelude::*;

declare_id!("9FWHk9NLMXZDJgxkpF4sWmpBD9UusHW3KwGoTzw3JaFR");

#[program]
pub mod journal {
    use super::*;

    pub fn initialize_journal(
        ctx: Context<CreateJournal>,
        title: String,
        description: String,
    ) -> Result<()> {
        msg!("Journal Entry Created");
        msg!("Title: {}", title);
        msg!("Description: {}", description);

        let journal = &mut ctx.accounts.journal;
        journal.owner = ctx.accounts.owner.key();
        journal.title = title;
        journal.description = description;

        Ok(())
    }

    pub fn update_journal(
        ctx: Context<UpdateJournal>,
        title: String,
        description: String,
    ) -> Result<()> {
        msg!("Journal Entry Updated");
        msg!("Title: {}", title);
        msg!("Description: {}", description);

        let journal = &mut ctx.accounts.journal;
        journal.title = title;
        journal.description = description;

        Ok(())
    }

    pub fn delete_journal(ctx: Context<DeleteJournal>, title: String) -> Result<()> {
        msg!("Journal entry titled '{}' deleted", title);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(title: String, description: String)]
pub struct CreateJournal<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + 32 + 4 + title.len() + 4 + description.len(),
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump
    )]
    pub journal: Account<'info, JournalState>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String, description: String)]
pub struct UpdateJournal<'info> {
    #[account(
        mut,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        realloc = 8 + 32 + 4 + title.len() + 4 + description.len(),
        realloc::payer = owner,
        realloc::zero = true
    )]
    pub journal: Account<'info, JournalState>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct DeleteJournal<'info> {
    #[account(
        mut,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        close = owner
    )]
    pub journal: Account<'info, JournalState>,

    #[account(mut)]
    pub owner: Signer<'info>,
}

#[account]
pub struct JournalState {
    pub owner: Pubkey,
    pub title: String,
    pub description: String,
}